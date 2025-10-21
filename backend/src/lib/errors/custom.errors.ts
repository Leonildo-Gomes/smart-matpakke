export class CustomError extends Error {
  public readonly statusCode: number;
  public readonly errorCode?: string; // Optional custom error code

  constructor(message: string, statusCode: number = 500, errorCode: string | undefined=undefined) {
    super(message);
    this.name = this.constructor.name; // Set name to class name
    this.statusCode = statusCode;
    

    // This line is important for proper error stack traces in Node.js
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export class InvalidCredentialsError extends CustomError {
  constructor(message = 'Invalid credentials') {
    super(message, 401, 'INVALID_CREDENTIALS'); // Default status 401 for invalid credentials
  }
}

// Adicione outras classes de erro personalizadas aqui, se necessário
// Exemplo:
// export class NotFoundError extends CustomError {
//   constructor(message = 'Recurso não encontrado') {
//     super(message, 404, 'NOT_FOUND');
//   }
// }