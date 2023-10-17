export class IpcMainBaseController {
  prefix: string
  constructor(prefix: string) {
    this.prefix = prefix
  }

  getChannelName(name: string) {
    return [this.prefix, name].join(':')
  }
}
