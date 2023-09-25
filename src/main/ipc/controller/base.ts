export class IpcMainBaseController {
  prefix: string;
  constructor(prefix: string) {
    this.prefix = prefix
    this.create()
  }

  getChannelName(name: string) {
    return [this.prefix, name].join(':')
  }

  create() {

  }
}