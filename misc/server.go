// https://blog.logrocket.com/creating-a-web-server-with-golang/

package main

import (
    "fmt"
    "flag"
    "log"
    "net/http"
)

func main() {
    portPtr := flag.Int("port", 8080, "port number to serve on")
    
    flag.Parse()
    
    fmt.Printf("starting server @ localhost on %d...\n", *portPtr)
    
    fileServer := http.FileServer(http.Dir("./"))
    http.Handle("/", fileServer)
    
    port := fmt.Sprint(":", *portPtr)
    
    if err := http.ListenAndServe(port, nil); err != nil {
        log.Fatal(err)
    }
}