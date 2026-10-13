declare namespace NodeJS {
  interface Global {
    ux: any
  }
}

// object-treeify ships no type declarations
declare module 'object-treeify' {
  export default function treeify(tree: Record<string, unknown>, options?: Record<string, unknown>): string
}
