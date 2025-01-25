import { pathToRegexp } from 'path-to-regexp'

const routers = []

export function getRouters() {
    return routers
}

export function match(path: string) {
    const matched = {
        path: [],
    }

    for (let len = routers.length, i = 0; i < len; i++) {
        let layer = routers[i]
        if (layer.match(path)) {
            matched.path.push(layer)
        }
    }

    return matched.path
}


export function use(path: string, fn) {
    const layer = {
        path,
        regexp: pathToRegexp(path),
        fns: [fn],
        match() {
            return this.regexp.regexp.test(path)
        }
    }
    routers.push(layer)
}

export async function getMessage(path) {
    const matched = match(path)
    if (matched.length === 0) {
        return '404'
    }

    const res = []
    for (let i = 0; i < matched.length; i++) {
        const element = matched[i];
        const result = await Promise.all(element.fns.map(fn => fn()))
        res.push(result)
    }
    return res
}