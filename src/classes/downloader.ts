const launchTime = Math.floor((new Date()).getTime() / 1000)

class Downloader {
  protected readonly linkElement: HTMLElement = (() => {
    const link = document.createElement("a")
    link.id = "downloader_link"

    return link
  })()

  protected createFilename(prefix: string, t: number, extension: string): string {
    const timestamp = Math.floor(t)
      .toString()
      .padStart(8, "0")

    return `${launchTime}__${timestamp}.${extension}`
  }
}

export class ScreenshotDownloader extends Downloader {
  public constructor(private readonly canvasElement: HTMLCanvasElement) {
    super()
  }

  public saveScreenshot(t: number) {
    const filename = this.createFilename("", t, "png")
    this.linkElement.setAttribute("download", filename)
    this.linkElement.setAttribute("href", this.canvasElement.toDataURL("image/png")
      .replace("image/png", "image/octet-stream"))
    this.linkElement.click()
    console.log(`Saved: ${filename}`)
  }
}
