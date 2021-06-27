//
// Copyright (c) 2021-present Ganbaro Digital Ltd
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//
//   * Re-distributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//
//   * Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in
//     the documentation and/or other materials provided with the
//     distribution.
//
//   * Neither the names of the copyright holders nor the names of his
//     contributors may be used to endorse or promote products derived
//     from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
// FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
// COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
// INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
// CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
// LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
// ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.
//

import { DataPath, UnreachableCodeError } from "@safelytyped/core-types";
import { expect } from "chai";
import { describe } from "mocha";
import { makeObjectDescription } from "../ObjectDescription";
import { makeObjectRequirements } from "../ObjectRequirements";
import { applyObjectValidators } from "./applyObjectValidators";

describe("applyObjectValidators", () => {
    it("executes ObjectValidator functions against the given object", () => {
        // ----------------------------------------------------------------
        // setup your test

        const fnCalled: string[] = [];
        const fn1 = (input: object) => {
            fnCalled.push("fn1 called");

            return input;
        }
        const fn2 = (input: object) => {
            fnCalled.push("fn2 called");

            return input;
        }
        const fn3 = (input: object) => {
            fnCalled.push("fn3 called");

            return input;
        }

        const expectedResult = [
            "fn1 called",
            "fn2 called",
            "fn3 called",
        ];

        const objectReqs = makeObjectRequirements({
            additionalValidators: [
                (reqs, objDesc, path, input) => fn1(input),
                (reqs, objDesc, path, input) => fn2(input),
                (reqs, objDesc, path, input) => fn3(input),
            ]
        });
        expect(objectReqs.objectValidators.length).to.equal(3);

        const inputValue = {};
        const objectDesc = makeObjectDescription(objectReqs, inputValue);

        // ----------------------------------------------------------------
        // perform the change

        applyObjectValidators(
            objectReqs, objectDesc, "." as DataPath, inputValue
        );

        // ----------------------------------------------------------------
        // test the results

        expect(fnCalled).eql(expectedResult);
    });

    it("stops on the first failure", () => {
        // ----------------------------------------------------------------
        // setup your test

        const fnCalled: string[] = [];
        const fn1 = (input: object) => {
            fnCalled.push("fn1 called");

            return input;
        }
        const fn2 = (input: object) => {
            fnCalled.push("fn2 called");

            return new UnreachableCodeError({
                public: {
                    reason: "unit test"
                }
            });
        }
        const fn3 = (input: object) => {
            fnCalled.push("fn3 called");

            return input;
        }

        const expectedResult = [
            "fn1 called",
            "fn2 called",
        ];

        const objectReqs = makeObjectRequirements({
            additionalValidators: [
                (reqs, objDesc, path, input) => fn1(input),
                (reqs, objDesc, path, input) => fn2(input),
                (reqs, objDesc, path, input) => fn3(input),
            ]
        });
        expect(objectReqs.objectValidators.length).to.equal(3);

        const inputValue = {};
        const objectDesc = makeObjectDescription(objectReqs, inputValue);

        // ----------------------------------------------------------------
        // perform the change

        applyObjectValidators(
            objectReqs, objectDesc, "." as DataPath, inputValue
        );

        // ----------------------------------------------------------------
        // test the results

        expect(fnCalled).eql(expectedResult);
    });
});