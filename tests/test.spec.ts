import 'reflect-metadata'

import { describe, it, expect } from "@jest/globals"
import { embedContaining, executeCommandAndSpyReply } from "./utils/tests"
import TestCommand from "../src/commands/General/test"

describe('Global test', () => {

    it('should test it', async() => {

        const command = new TestCommand()
        const spy = await executeCommandAndSpyReply(command.test, { id: '123456789',  name: 'test', type: 1 })

        expect(spy).toBeCalledWith(embedContaining({ description: 'test' }))
    })
})