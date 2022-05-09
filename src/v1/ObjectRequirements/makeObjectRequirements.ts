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

import { applyFunctionalOptions, FunctionalOption, SmartConstructorOptions, THROW_THE_ERROR } from "@safelytyped/core-types";
import { ObjectRequirements } from "./ObjectRequirements";
import { ObjectRequirementsData } from "./ObjectRequirementsData";

type SmartConstructor<IN, OUT, OPT extends SmartConstructorOptions = SmartConstructorOptions, FN = OUT, FN_OPT extends SmartConstructorOptions = OPT> = (
    input: IN,
    options?: Partial<OPT>,
    ...fnOptions: FunctionalOption<FN, Partial<FN_OPT>>[]
) => OUT;

type makeObjectRequirementsFn<T extends object = object> = SmartConstructor<ObjectRequirementsData<T>, ObjectRequirements<T>>;

/**
 * `makeObjectRequirements()` is a {@link SmartConstructor}.
 *
 * Use it to create a set of {@link ObjectRequirements} that you can use
 * to validate one or more objects.
 *
 * @param input
 * A map of requirements
 * @param onError
 * The error handler to call if something goes wrong.
 * Defaults to `THROW_THE_ERROR`
 * @param fnOpts
 * Functional options to call after the requirements have been made.
 * @returns
 */
export const makeObjectRequirements: makeObjectRequirementsFn
= (
    input: ObjectRequirementsData,
    {
        onError = THROW_THE_ERROR
    }: Partial<SmartConstructorOptions> = {},
    ...fnOpts: FunctionalOption<ObjectRequirements>[]
): ObjectRequirements => {
    return applyFunctionalOptions(
        new ObjectRequirements(input),
        { onError },
        ...fnOpts
    );
}