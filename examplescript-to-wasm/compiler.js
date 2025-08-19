import binaryen from './binaryen.js';

export default class Compiler {
  compile(parsed) {
    const module = new binaryen.Module();

    for (const line of parsed) {
      const { firstOperand, operator, secondOperand } = line;

      if (operator === '+') {
        module.addFunction(
          'add', // name: string
          binaryen.createType([binaryen.i32, binaryen.i32]), // params: Type
          binaryen.i32, // results: Type
          [binaryen.i32], // vars: Type[]
          //  body: ExpressionRef
          module.block(null, [
            module.local.set(
              2,
              module.i32.add(
                module.local.get(0, binaryen.i32),
                module.local.get(1, binaryen.i32)
              )
            ),
            module.return(module.local.get(2, binaryen.i32)),
          ])
        );
        module.addFunctionExport('add', 'add');
      } else if (operator === '-') {
        module.addFunction(
          'subtract', // name: string
          binaryen.createType([binaryen.i32, binaryen.i32]), // params: Type
          binaryen.i32, // results: Type
          [binaryen.i32], // vars: Type[]
          //  body: ExpressionRef
          module.block(null, [
            module.local.set(
              2,
              module.i32.sub(
                module.local.get(0, binaryen.i32),
                module.local.get(1, binaryen.i32)
              )
            ),
            module.return(module.local.get(2, binaryen.i32)),
          ])
        );
        module.addFunctionExport('subtract', 'subtract');
      } else if (operator === '*') {
        module.addFunction(
          'multiply', // name: string
          binaryen.createType([binaryen.i32, binaryen.i32]), // params: Type
          binaryen.i32, // results: Type
          [binaryen.i32], // vars: Type[]
          //  body: ExpressionRef
          module.block(null, [
            module.local.set(
              2,
              module.i32.mul(
                module.local.get(0, binaryen.i32),
                module.local.get(1, binaryen.i32)
              )
            ),
            module.return(module.local.get(2, binaryen.i32)),
          ])
        );
        module.addFunctionExport('multiply', 'multiply');
      } else if (operator === '/') {
        module.addFunction(
          'divide', // name: string
          binaryen.createType([binaryen.f64, binaryen.f64]), // params: Type
          binaryen.f64, // results: Type
          [binaryen.f64], // vars: Type[]
          //  body: ExpressionRef
          module.block(null, [
            module.local.set(
              2,
              module.f64.div(
                module.local.get(0, binaryen.f64),
                module.local.get(1, binaryen.f64)
              )
            ),
            module.return(module.local.get(2, binaryen.f64)),
          ])
        );
        module.addFunctionExport('divide', 'divide');
      }
    }

    module.addFunction(
      'deadcode', // name: string
      binaryen.createType([binaryen.i32, binaryen.i32]), // params: Type
      binaryen.i32, // results: Type
      [binaryen.i32], // vars: Type[]
      //  body: ExpressionRef
      module.block(null, [
        module.local.set(
          2,
          module.i32.div_u(
            module.local.get(0, binaryen.i32),
            module.local.get(1, binaryen.i32)
          )
        ),
        module.return(module.local.get(2, binaryen.i32)),
      ])
    );

    if (!module.validate()) {
      throw new Error('Validation error');
    }

    return module;
  }

  optimize(module) {
    module.optimize();
    return module;
  }
}
