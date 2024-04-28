type OriginType = string | boolean | RegExp;
type ValueOrArray<T> = T | ArrayOfValueOrArray<T>;
type OriginCallback = (err: Error | null, origin: ValueOrArray<OriginType>) => void;
interface ArrayOfValueOrArray<T> extends Array<ValueOrArray<T>> {}

export const corsPolicy = (origin: string | undefined, cb: OriginCallback) => {
  try {
    const hostname = getHostName(origin);
    if (hostname === 'localhost') {
      cb(null, true);
      return;
    }
    if (hostname === '') {
      cb(null, true);
      return;
    }
    if (hostname === 'website.com') {
      cb(null, true);
      return;
    }
    cb(new Error('Not allowed'), false);
  } catch (error) {
    console.error(error);
  }
};

const getHostName = (o?: string): string => {
  try {
    if (!o) return '';
    return new URL(o).hostname;
  } catch (error) {
    return '';
  }
};
