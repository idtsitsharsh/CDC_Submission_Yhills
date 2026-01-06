import { ZodError } from "zod";
import { NextResponse } from "next/server";

export function validate(schema, data) {
  try {
    return {
      success: true,
      data: schema.parse(data),
    };
  } catch (err) {
    if (err instanceof ZodError) {
      return {
        success: false,
        errors: err.issues.map(e => e.message),
      };
    }

    return {
      success: false,
      errors: ["Invalid request payload"],
    };
  }
}

export function validationError(errors, status = 400) {
  return NextResponse.json(
    {
      success: false,
      message: "Validation failed",
      errors,
    },
    { status }
  );
}
