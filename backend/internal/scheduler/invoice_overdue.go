package scheduler

import (
	"context"

	"smartdorm/infrastructure/db"
	// "smartdorm/shared/events" - we don't have a specific event for OVERDUE yet, but could add one
)

type InvoiceOverdueJob struct {
	db *db.Database
}

func NewInvoiceOverdueJob(db *db.Database) *InvoiceOverdueJob {
	return &InvoiceOverdueJob{
		db: db,
	}
}

func (j *InvoiceOverdueJob) Name() string {
	return "InvoiceOverdueJob"
}

// Run finds all PENDING invoices where due_date < today and marks them as OVERDUE
func (j *InvoiceOverdueJob) Run(ctx context.Context) error {
	// Simple bulk update for MVP since there are no events currently tied to this transition
	const qUpdate = `
		UPDATE invoices 
		SET status = 'OVERDUE', updated_at = NOW() 
		WHERE status = 'PENDING' AND due_date < CURRENT_DATE`

	_, err := j.db.Pool.Exec(ctx, qUpdate)
	if err != nil {
		return err
	}

	return nil
}
