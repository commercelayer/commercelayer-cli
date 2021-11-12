
const baseURL = (slug: string, domain: string | undefined): string => {
  return `https://${slug.toLowerCase()}.${domain ? domain : 'commercelayer.io'}`
}

const fixType = (val: string): string | number | boolean | null | undefined => {

  let v: any = val

  if (v === 'null') v = null
  else
    // eslint-disable-next-line eqeqeq
    if (Number(v) == v) v = Number(v)
    else v = (v === 'true') ? true : (v === 'false') ? false : v

  return v

}


/*
One way would be using a Positive Lookahead assertion here.

var str = '"Foo","Bar, baz","Lorem","Ipsum"',
    res = str.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

console.log(res);  // [ '"Foo"', '"Bar, baz"', '"Lorem"', '"Ipsum"' ]
Regular expression:

,               ','
(?=             look ahead to see if there is:
(?:             group, but do not capture (0 or more times):
(?:             group, but do not capture (2 times):
 [^"]*          any character except: '"' (0 or more times)
 "              '"'
){2}            end of grouping
)*              end of grouping
 [^"]*          any character except: '"' (0 or more times)
$               before an optional \n, and the end of the string
)               end of look-ahead
Or a Negative Lookahead

var str = '"Foo","Bar, baz","Lorem","Ipsum"',
    res = str.split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);

console.log(res); // [ '"Foo"', '"Bar, baz"', '"Lorem"', '"Ipsum"' ]
*/
const splitSlash = (str: string): string[] => {
  // return str.split(/\/(?=(?:(?:[^"]*"){2})*[^"]*$)/)
  // return str.split(/\/(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/)
  return str.split(/\/(?=(?:(?:[^"]*"){2})*[^"]*$)/)
}


export { baseURL, fixType, splitSlash }
