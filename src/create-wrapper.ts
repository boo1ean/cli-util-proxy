import Wrapper from './wrapper'

export default function createWrapper (command: string) {
    return new Wrapper(command);
}