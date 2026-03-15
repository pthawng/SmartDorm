package scheduler

import (
	"context"
	"log/slog"
	"sync"
	"time"
)

type Job interface {
	Name() string
	Run(ctx context.Context) error
}

type Scheduler struct {
	jobs    []Job
	ticker  *time.Ticker
	quit    chan struct{}
	wg      sync.WaitGroup
	running bool
	mu      sync.Mutex
}

func NewScheduler(interval time.Duration) *Scheduler {
	return &Scheduler{
		ticker: time.NewTicker(interval),
		quit:   make(chan struct{}),
	}
}

func (s *Scheduler) Register(job Job) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.jobs = append(s.jobs, job)
	slog.Info("Registered scheduler job", "job", job.Name())
}

func (s *Scheduler) Start() {
	s.mu.Lock()
	if s.running {
		s.mu.Unlock()
		return
	}
	s.running = true
	s.mu.Unlock()

	s.wg.Add(1)
	go func() {
		defer s.wg.Done()
		slog.Info("Scheduler started")
		for {
			select {
			case <-s.ticker.C:
				s.runJobs()
			case <-s.quit:
				s.ticker.Stop()
				slog.Info("Scheduler stopped")
				return
			}
		}
	}()
}

func (s *Scheduler) Stop() {
	s.mu.Lock()
	defer s.mu.Unlock()
	if !s.running {
		return
	}
	close(s.quit)
	s.running = false
	s.wg.Wait()
}

func (s *Scheduler) runJobs() {
	// Simple MVP implementation: runs jobs sequentially on the tick
	// In a scaled prod environment, this might enqueue messages to Redis/RabbitMQ
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()

	s.mu.Lock()
	jobs := make([]Job, len(s.jobs))
	copy(jobs, s.jobs)
	s.mu.Unlock()

	for _, job := range jobs {
		slog.Info("Running scheduled job", "job", job.Name())
		start := time.Now()
		
		if err := job.Run(ctx); err != nil {
			slog.Error("Scheduled job failed", "job", job.Name(), "error", err, "duration", time.Since(start))
		} else {
			slog.Info("Scheduled job completed", "job", job.Name(), "duration", time.Since(start))
		}
	}
}
