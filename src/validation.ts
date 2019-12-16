const IP = require('ip');

export default {
  parseIP(ip: string): boolean {
    return IP.isV4Format(ip) || IP.isV6Format(ip);
  }
}