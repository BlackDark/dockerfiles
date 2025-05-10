# Start from the official Golang image
FROM golang:1.24.3

# Set the Current Working Directory inside the container
WORKDIR /app

COPY docker-install.sh .
RUN ./docker-install.sh

# Copy the go.mod and go.sum files
COPY go.mod ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source code into the container
COPY main.go ./

# Build the Go app
RUN go build -o main .

# This container exposes port 8080 to the outside world
EXPOSE 8080

# Run the executable
CMD ["./main"]
