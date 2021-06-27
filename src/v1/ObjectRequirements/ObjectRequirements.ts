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

import { AppErrorOr, DataPath, validate, validateObject } from "@safelytyped/core-types";
import { makeObjectDescription, ObjectDescription } from "../ObjectDescription";
import { applyObjectValidators } from "../ObjectValidator";
import { ObjectValidator } from "../ObjectValidator/ObjectValidator";
import { validateOptionalObjectProperties, validateRequiredObjectProperties } from "../ObjectValidators";
import { ObjectPropertyValidators, ObjectRequirementsData } from "./ObjectRequirementsData";


export class ObjectRequirements<T extends object = object> {
    public readonly allKeys: string[];
    public readonly requiredKeys: string[];
    public readonly optionalKeys: string[];

    public readonly propertyValidators: ObjectPropertyValidators;
    public readonly objectValidators: ObjectValidator<T>[];

    public constructor (input: ObjectRequirementsData<T>) {
        this.propertyValidators = { ...input.requiredProperties, ...input.optionalProperties };
        this.objectValidators = input.additionalValidators ?? [];

        // for convenience, we calculate these, so that the caller doesn't
        // have to manage these lists for themselves
        this.allKeys = Object.keys(this.propertyValidators);
        this.requiredKeys = Object.keys(input.requiredProperties ?? {});
        this.optionalKeys = Object.keys(input.optionalProperties ?? {});
    }

    public validate(path: DataPath, input: unknown): AppErrorOr<T> {
        // we'll fill this in shortly, just as soon as we're sure
        // that we have an object
        let objDesc: ObjectDescription;

        return validate(input)
            .next((x) => validateObject(path, x))
            .next((x) => { objDesc = makeObjectDescription(this, x); return x })
            .next((x) => validateRequiredObjectProperties<T>(this, objDesc, path, x))
            .next((x) => validateOptionalObjectProperties<T>(this, objDesc, path, x))
            .next((x) => applyObjectValidators(this, objDesc, path, x))
            .value();
    }
}