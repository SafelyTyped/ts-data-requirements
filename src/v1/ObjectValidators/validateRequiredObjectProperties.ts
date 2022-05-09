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
import { AppError, AppErrorOr, DataPath, extendDataPath } from "@safelytyped/core-types";

import { ObjectPropertiesNotFoundError } from "../Errors";
import { ObjectDescription } from "../ObjectDescription";
import { ObjectRequirements } from "../ObjectRequirements";

/**
 *
 * @param path
 * @param input
 * @param requiredProperties
 * @param optionalProperties
 *
 * @category BasicTypes
 */
export function validateRequiredObjectProperties<T extends object = object>(
    reqs: ObjectRequirements<T>,
    desc: ObjectDescription,
    path: DataPath,
    input: object,
): AppErrorOr<T> {
    // step 1: check the list of keys we've found
    if (desc.requiredKeys.length !== reqs.requiredKeys.length) {
        return new ObjectPropertiesNotFoundError({
            public: {
                dataPath: path,
                missingProperties: reqs.requiredKeys.filter((x) => !desc.requiredKeys.includes(x))
            }
        });
    }

    // step 2: check the required properties to make sure they all validate
    let retval: AppErrorOr<T> = input as T;
    reqs.requiredKeys.every((key) => {
        const res = reqs.propertyValidators[key](
            extendDataPath(path, key),
            input[key as keyof object],
            {}
        );
        if (res instanceof AppError) {
            retval = res;
        }

        return (!(res instanceof AppError));
    });

    // all done
    return retval;
}
