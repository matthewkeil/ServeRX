import { Parameters } from './../messages/Request';

export type MatchString = string[]

export class Ms {

	static extractParams(ms: MatchString): Parameters {

		let params = <Parameters>{}
		
		ms.forEach(segment => {
			let results = /=/.exec(segment)

			if (results) {
				let param = segment.substr(0, results.index)
				let value = segment.substring(results.index + 1).split(',')

				params[param] = value[1] ? value : value[0]
			}
		 })
		 
		 return params
	}

	static pathToMs(input: string = ''): MatchString {

		let path = !input.startsWith('/') ? input : input.substring(1)

		if (path.endsWith('/')) path = path.slice(0, path.length-1)
		
		return path === '' ? [] : path.split('/')
	}

	static toPath(input: MatchString): string {
		return '/'.concat(input.join('/'))
	}

}