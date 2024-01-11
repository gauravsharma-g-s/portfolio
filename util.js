export const W = 'w'
export const A = 'a'
export const D = 'd'
export const S = 's'

export const DIRECTIONS = [W, A, D, S]
export class KeyDisplay {
    constructor() {
        this.map = new Map()
        const w = document.createElement('div')
        const a = document.createElement('div')
        const d = document.createElement('div')
        const s = document.createElement('div')

        this.map.set(W, w)
        this.map.set(A, a);
        this.map.set(S, s);
        this.map.set(D, d);

        this.map.forEach((v, k) => {
            v.style.color = 'green'
            v.style.fontSize = '50px'
            v.style.fontWeight = '800'
            v.style.position = 'absolute'
            v.textContent = k
        })

        this.updatePosition()

        this.map.forEach((v, k) => {
            document.body.append(v)
        })
    }

    updatePosition() {
        this.map.get(W).style.top = `${window.innerHeight - 250}px`
        this.map.get(A).style.top = `${window.innerHeight - 200}px`
        this.map.get(S).style.top = `${window.innerHeight - 200}px`
        this.map.get(D).style.top = `${window.innerHeight - 200}px`

        this.map.get(W).style.right = `${300}px`
        this.map.get(A).style.right = `${200}px`
        this.map.get(S).style.right = `${300}px`
        this.map.get(D).style.right = `${400}px`
    }

    down(key) {
        if (this.map.has(key)) {
            this.map.get(key).style.color = 'yellow';
        }
    }

    up(key) {
        if (this.map.has(key)) {
            this.map.get(key).style.color = 'green';
        }
    }
}