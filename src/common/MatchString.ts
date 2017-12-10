
export type MatchString = string[]

export class MS {

	static isValidPath(input: string): boolean {

	}

	static pathToMS(input: string = ''): MatchString {

		let path = input

		if (path.startsWith('/')) path = path.substring(1)
		if (path.endsWith('/')) path = path.slice(0, path.length-1)
		
		return path === '' ? [] : path.split('/')
	}

	static toPath(input: MatchString): string {

		let string = ''


		return string
	}

}