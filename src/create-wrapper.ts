import Wrapper from './wrapper'

export function createProxy (command: string) {
    return new Wrapper(command);
}
