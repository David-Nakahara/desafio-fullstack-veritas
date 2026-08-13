package main

import (
	"log"
	"net/http"
)

func main() {
	store := NewTaskStore()
	handler := NewTaskHandler(store)

	mux := http.NewServeMux()

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok"))
	})

	mux.HandleFunc("GET /tasks", handler.list)
	mux.HandleFunc("POST /tasks", handler.create)
	mux.HandleFunc("GET /tasks/{id}", handler.get)
	mux.HandleFunc("PUT /tasks/{id}", handler.update)
	mux.HandleFunc("DELETE /tasks/{id}", handler.delete)

	log.Println("Servidor rodando em http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", corsMiddleware(mux)))
}
