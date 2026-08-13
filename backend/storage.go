package main

import (
	"sync"

	"github.com/google/uuid"
)

type TaskStore struct {
	mu    sync.RWMutex
	tasks map[string]Task
}

func NewTaskStore() *TaskStore {
	return &TaskStore{
		tasks: make(map[string]Task),
	}
}

// GetAll retorna todas as tarefas.
func (s *TaskStore) GetAll() []Task {
	s.mu.RLock()
	defer s.mu.RUnlock()

	result := make([]Task, 0, len(s.tasks))
	for _, t := range s.tasks {
		result = append(result, t)
	}
	return result
}

func (s *TaskStore) Get(id string) (Task, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	t, ok := s.tasks[id]
	return t, ok
}

func (s *TaskStore) Create(title, description string, status Status) Task {
	s.mu.Lock()
	defer s.mu.Unlock()

	task := Task{
		ID:          uuid.NewString(),
		Title:       title,
		Description: description,
		Status:      status,
	}
	s.tasks[task.ID] = task
	return task
}

func (s *TaskStore) Update(id, title, description string, status Status) (Task, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()

	existing, ok := s.tasks[id]
	if !ok {
		return Task{}, false
	}

	existing.Title = title
	existing.Description = description
	existing.Status = status
	s.tasks[id] = existing

	return existing, true
}

func (s *TaskStore) Delete(id string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, ok := s.tasks[id]; !ok {
		return false
	}
	delete(s.tasks, id)
	return true
}
