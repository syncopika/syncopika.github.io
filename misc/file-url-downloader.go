// simple file download from a url with GUI example using Fyne

// for compiling this I used:
// go1.20.2 windows/amd64 (at first I had 1.15 but there were issues - see https://github.com/golang/go/issues/51007)
// the Win64 version of "GCC 11.2.0 + MinGW-w64 10.0.0 (UCRT) - release 1" from https://winlibs.com/
// +follow installation instructions on fyne.io

package main

import (
    "fmt"
    "os"
    "net/http"
    "io"
    "strings"
    
    "fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
    "fyne.io/fyne/v2/container"
    "fyne.io/fyne/v2/dialog"
	"fyne.io/fyne/v2/widget"
)

// TODO:
// - progress bar for download (https://developer.fyne.io/widget/progressbar)
// https://stackoverflow.com/questions/11692860/how-can-i-efficiently-download-a-large-file-using-go
// maybe helpful? https://stackoverflow.com/questions/71732895/http-file-download-progress-bar-in-go
// https://stackoverflow.com/questions/46054094/golang-download-file-and-follow-redirects

func downloadFileFromUrl(filepath string, url string, statusText *widget.Label) (err error) {    
    statusText.SetText("getting: " + url)
    
    resp, err := http.Get(url)
    if err != nil {
        return err
    }
    defer resp.Body.Close()
    
    fmt.Println("get file OK")
    
    if resp.StatusCode != http.StatusOK {
        return fmt.Errorf("error status: %s", resp.Status)
    }
    statusText.SetText("GET success")
    
    finalUrl := resp.Request.URL.String()
    urlParts := strings.Split(finalUrl, "/")
    filename := urlParts[len(urlParts) - 1]
    
    out, err := os.Create(filepath + "/" + filename)
    if err != nil {
        return err
    }
    defer out.Close()
    
    _, err = io.Copy(out, resp.Body)
    if err != nil {
        return err
    }
    
    fmt.Println("file successfully downloaded")
    statusText.SetText("download successful!")
    
    return nil
}

func main() {
    a := app.New()
    window := a.NewWindow("Hello")
    window.Resize(fyne.NewSize(600, 450))
    
    input := widget.NewEntry()
    input.SetPlaceHolder("url to download from")

    label := widget.NewLabel("enter a url to download from and specify a directory to download to on click")
    
    statusText := widget.NewLabel("")
    
    window.SetContent(container.NewVBox(
        label,
        input,
        widget.NewButton("click", func() {
            folderPicker := dialog.NewFolderOpen(func(dir fyne.ListableURI, err error) {
                if dir != nil {
                    fmt.Println(input.Text)
                    fmt.Println(dir.Path())
                    
                    downloadFileFromUrl(dir.Path(), input.Text, statusText)
                }
            }, window)
            
            folderPicker.Show()
            
            folderPicker.Resize(fyne.NewSize(600, 600)) // can only be <= parent window dimensions it seems? :/
        }),
        statusText,
    ))

    window.ShowAndRun()
}