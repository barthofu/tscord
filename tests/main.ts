import { imageHash } from 'image-hash'
import { promisify } from 'util'

const foo = promisify(imageHash)

async function test () {

    return await foo(
        './assets/images/tscord-template-icon.png',
        16,
        true
    )
}

test().then(console.log)