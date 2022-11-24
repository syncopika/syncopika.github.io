// https://blog.logrocket.com/creating-a-web-server-with-golang/

package main

import (
    "fmt"
    "log"
    "net/http"
)

func main() {
    fileServer := http.FileServer(http.Dir("./"))
    http.Handle("/", fileServer)
    
    fmt.Printf("starting server @localhost on port 8080...\n")
    if err := http.ListenAndServe(":8080", nil); err != nil {
        log.Fatal(err)
    }
}