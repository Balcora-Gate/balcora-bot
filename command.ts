import InfoCommand from './commands/info';
import HelpCommand from './commands/help';

const index = {
	info: new InfoCommand(),
	help: new HelpCommand()
};

export const COMMAND_LIST = Object.keys(index);
export type CommandType = keyof typeof index;
export default index;
