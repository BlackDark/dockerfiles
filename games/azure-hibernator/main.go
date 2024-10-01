package main

import (
	"fmt"
	"net/http"
	"os/exec"
)

// runScript executes the given bash script and returns the output or an error.
func runScript(script string) (string, error) {
	out, err := exec.Command("/bin/bash", "-c", script).Output()
	if err != nil {
		return "", err
	}
	return string(out), nil
}

// handleStart handles the start request.
func handleStart(w http.ResponseWriter, r *http.Request) {
	output, err := runScript("/scripts/start.sh")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Fprintf(w, "Start script output:\n%s", output)
}

// handleHibernate handles the hibernate request.
func handleHibernate(w http.ResponseWriter, r *http.Request) {
	output, err := runScript("/scripts/hibernate.sh")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Fprintf(w, "Hibernate script output:\n%s", output)
}

// handleStatus handles the status request.
func handleStatus(w http.ResponseWriter, r *http.Request) {
	output, err := runScript("/scripts/status.sh")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Fprintf(w, "Status script output:\n%s", output)
}

func main() {
	http.HandleFunc("/start", handleStart)
	http.HandleFunc("/hibernate", handleHibernate)
	http.HandleFunc("/status", handleStatus)

	fmt.Println("Server started at http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		fmt.Printf("Error starting server: %s\n", err)
	}
}
