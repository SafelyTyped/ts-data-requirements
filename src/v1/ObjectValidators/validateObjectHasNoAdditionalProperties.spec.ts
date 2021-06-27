//
// Copyright (c) 2020-present Ganbaro Digital Ltd
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
import { AppError, DEFAULT_DATA_PATH, validateString } from "@safelytyped/core-types";
import { expect } from "chai";
import { describe } from "mocha";

import { makeObjectDescription } from "../ObjectDescription";
import { ObjectRequirements } from "../ObjectRequirements";
import { validateObjectHasNoAdditionalProperties } from "./validateObjectHasNoAdditionalProperties";

describe("validateObjectHasNoAdditionalProperties()", () => {
    it("returns `input` if only required and optional properties are present", () => {
        const unit = {
            foo: "bar",
            fish: "trout",
        };
        const reqs = new ObjectRequirements({
            requiredProperties: {
                fish: validateString,
            },
            optionalProperties: {
                foo: validateString,
            },
        });
        const desc = makeObjectDescription(reqs, unit);

        const actualValue = validateObjectHasNoAdditionalProperties(
            reqs,
            desc,
            DEFAULT_DATA_PATH,
            unit,
        );

        expect(actualValue).to.equal(unit);
    });

    it("returns an `AppError` if `input` contains any unlisted properties", () => {
        const unit = {
            foo: "bar",
            fish: "trout",
            harry: "sally",
            donald: "duck",
        };
        const reqs = new ObjectRequirements({
            requiredProperties: {
                fish: validateString,
            },
            optionalProperties: {
                foo: validateString,
            },
        });
        const desc = makeObjectDescription(reqs, unit);

        const actualValue = validateObjectHasNoAdditionalProperties(
            reqs,
            desc,
            DEFAULT_DATA_PATH,
            unit,
        );

        expect(actualValue).to.be.instanceOf(AppError);
    });
});
