import InfoCommand from './commands/info';
import HelpCommand from './commands/help';
import DPSCommand from './commands/dps';

const index = {
	info: new InfoCommand(),
	help: new HelpCommand(),
	dps: new DPSCommand()
};

export const COMMAND_LIST = Object.keys(index);
export type CommandType = keyof typeof index;
export default index;
