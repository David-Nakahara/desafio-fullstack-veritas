package main

import (
	"encoding/json"
	"net/http"
	"strings"
)

// TaskHandler agrupa os handlers HTTP e a dependência do storage.
type TaskHandler struct {
	store *TaskStore
}

func NewTaskHandler(store *TaskStore) *TaskHandler {
	return &TaskHandler{store: store}
}

func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}

// taskInput é o formato esperado no corpo do POST/PUT.
type taskInput struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      Status `json:"status"`
}

// validate confere as regras básicas exigidas pelo desafio: título obrigatório
// e status dentro dos três valores permitidos.
func validate(input taskInput) string {
	if strings.TrimSpace(input.Title) == "" {
		return "o título é obrigatório"
	}
	if !input.Status.IsValid() {
		return "status inválido: use 'todo', 'doing' ou 'done'"
	}
	return ""
}

func (h *TaskHandler) list(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, h.store.GetAll())
}

func (h *TaskHandler) get(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	task, ok := h.store.Get(id)
	if !ok {
		writeError(w, http.StatusNotFound, "tarefa não encontrada")
		return
	}
	writeJSON(w, http.StatusOK, task)
}

func (h *TaskHandler) create(w http.ResponseWriter, r *http.Request) {
	var input taskInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "corpo da requisição inválido")
		return
	}

	if input.Status == "" {
		input.Status = StatusTodo
	}

	if msg := validate(input); msg != "" {
		writeError(w, http.StatusBadRequest, msg)
		return
	}

	task := h.store.Create(input.Title, input.Description, input.Status)
	writeJSON(w, http.StatusCreated, task)
}

func (h *TaskHandler) update(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	var input taskInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "corpo da requisição inválido")
		return
	}

	if msg := validate(input); msg != "" {
		writeError(w, http.StatusBadRequest, msg)
		return
	}

	task, ok := h.store.Update(id, input.Title, input.Description, input.Status)
	if !ok {
		writeError(w, http.StatusNotFound, "tarefa não encontrada")
		return
	}

	writeJSON(w, http.StatusOK, task)
}

func (h *TaskHandler) delete(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if ok := h.store.Delete(id); !ok {
		writeError(w, http.StatusNotFound, "tarefa não encontrada")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
