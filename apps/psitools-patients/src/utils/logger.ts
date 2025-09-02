import type { User } from '@arianne/db';
import type { PrismaClient } from '@prisma/client';
import * as os from 'os';
import * as syslog from 'syslog-client';

import { env } from '@/env.mjs';

//import { genUUID } from './uuid';

const programName = 'PsitTools';
const options: syslog.ClientOptions = {
  syslogHostname: os.hostname(),
  transport: syslog.Transport.Udp,
  port: env.SYSLOG_PORT,
  rfc3164: false,
  appName: programName,
};

const client: syslog.Client = syslog.createClient(env.WAZUH_RSYSLOG, options);
client.on('close', function () {
  console.log('socket closed');
});
client.on('error', function (error: Error) {
  console.error('client error', error);
});

export type Action =
  | 'CREATE'
  | 'READ'
  | 'UPDATE'
  | 'DELETE'
  | 'READALL'
  | 'OTHER';
type Result = 'GRANTED' | 'DENIED' | 'OTHER';
interface TInfo {
  resource: string;
  user: User;
  owner: User | null;
  action: Action;
  result: Result;
}

interface Ctx {
  prisma: PrismaClient;
}

export async function getUserById(id: string, ctx: Ctx) {
  return await ctx.prisma.user.findUnique({ where: { id } });
}

export function doLog(info: TInfo) {
  if (!env.REMOTELOGGER) return; // do not log if REMOTELOGGER is not set

  const { resource, user, owner, action, result } = info;
  const userRoles = user.roles.map((r) => r).join(',');
  const logstring = `${resource} ${user.id}-${user.email} ${userRoles} ${
    owner?.id ?? 'unknown_id'
  }-${owner?.email ?? 'unkown_email'} ${action} ${result}`;

  const msgoptions: syslog.MessageOptions = {
    facility: syslog.Facility.Audit,
    severity:
      result === 'DENIED'
        ? syslog.Severity.Critical
        : syslog.Severity.Informational,
    //msgid: genUUID().split('-')[4],
    syslogHostname: os.hostname(),
  };
  console.log('HOSTNAME', os.hostname());
  console.log(client.buildFormattedMessage(logstring, msgoptions).toString());

  client.log(logstring, msgoptions, function (error: Error | null) {
    if (error) {
      console.log('send message: ', error);
    } else {
      console.log('send message: success');
    }
  });
}
const logger = (() => {
  const checkIfLogsEnabled = () => {
    if (env.REMOTELOGGER == 'true') {
      return true;
    }

    return false;
  };

  // eslint-disable-next-line no-restricted-properties
  const isDev = process.env.NODE_ENV !== 'production';

  const print = (type: string, ...messages: string[]) => {
    const areLogsEnabled = checkIfLogsEnabled();

    if (areLogsEnabled || isDev) {
      switch (type) {
        case 'info':
          console.info(
            '%c Custom Log:',
            'background: blue; color: white;',
            ...messages,
          );
          break;
        case 'warn':
          console.warn(
            '%c Custom Log:',
            'background: orange; color: white;',
            ...messages,
          );
          break;
        case 'error':
          console.error(
            '%c Custom Log:',
            'background: red; color: white;',
            ...messages,
          );
          break;
        case 'trace':
          console.trace(
            '%c Custom Log:',
            'background: grey; color: black;',
            ...messages,
          );
          break;
        case 'debug':
        default:
          console.log(
            '%c Custom Log:',
            'background: green; color: white;',
            ...messages,
          );
      }
    }
  };

  return {
    debug: print.bind(null, 'debug'),
    info: print.bind(null, 'info'),
    warn: print.bind(null, 'warn'),
    error: print.bind(null, 'error'),
    trace: print.bind(null, 'trace'),
  };
})();

export default logger;
