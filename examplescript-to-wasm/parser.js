export default class Parser {
  parse(input) {
    input = input.split(/\n/);
    input = input.filter(line => line.trim());
    if (!input.every((line) => /\d+\s*[\+\-\*\/]\s*\d+\s*/gm.test(line))) {
      throw new Error('Parse error');
    }
    
    return input.map((line) => {
      const { groups } =
        /(?<first_operand>\d+)\s*(?<operator>[\+\-\*\/])\s*(?<second_operand>\d+)/gm.exec(
          line
        );
      return {
        firstOperand: Number(groups.first_operand),
        operator: groups.operator,
        secondOperand: Number(groups.second_operand),
      };
    });
  }
}
