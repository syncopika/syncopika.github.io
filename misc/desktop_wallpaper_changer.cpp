/*
of course Windows 10 already has this feature built-in to use a slideshow for desktop wallpaper (with fade-in effect also!)
but it's pretty cool to know you can implement it yourself as well :)

references:
https://stackoverflow.com/questions/3331682/change-wallpaper-programmatically-using-c-and-windows-api
https://stackoverflow.com/questions/12207574/programmatically-change-the-desktop-wallpaper-periodically
https://stackoverflow.com/questions/34710677/systemparametersinfo-sets-wallpaper-completly-black-using-spi-setdeskwallpaper
https://stackoverflow.com/questions/56132584/draw-on-windows-10-wallpaper-in-c

TODO: fade-in effect


g++ -Wall -c -std=c++14 -lmingw32 -static-libstdc++ desktop_wallpaper_changer.cpp -o desktop_wallpaper_changer.exe
*/

#include <iostream>
#include <windows.h>
#include <vector>
#include <string>

int currWallpaperIndex = 0;

std::vector<std::string> wallpapers {
  "C:\\Users\\Nicholas\\Desktop\\anime_skies\\soranomethodep17.png",
  "C:\\Users\\Nicholas\\Desktop\\anime_skies\\priconne-ep9.png",
  "C:\\Users\\Nicholas\\Desktop\\anime_skies\\bokuyaba-12.5-sky.png"
};

VOID CALLBACK TimerProc(HWND hWnd, UINT msg, UINT idTimer, DWORD dwTime){
  const char* wallpaper = (char *)wallpapers[currWallpaperIndex].c_str();
  std::cout << "changing wallpaper to: " << wallpapers[currWallpaperIndex] << '\n';
  SystemParametersInfo(SPI_SETDESKWALLPAPER, 0, (void*)wallpaper, SPIF_SENDCHANGE);
  currWallpaperIndex = (currWallpaperIndex + 1) % wallpapers.size();
}


int main(void){
  std::cout << "starting desktop_wallpaper_changer..." << '\n';
  
  MSG msg;
  UINT timerId = SetTimer(NULL, 0, 10000, &TimerProc);
  
  while(GetMessage(&msg, NULL, 0, 0)){
    DispatchMessage(&msg);
  }
  
  KillTimer(NULL, timerId);

  return 0;
}