import { Context } from '../context';
export declare abstract class Drop {
    liquidMethodMissing(key: string | number, context: Context): Promise<any> | any;
}
