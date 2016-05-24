// Browsers that support the __Secure cookie prefix will reject this due to the
// missing Secure attribute.
document.cookie = '__Secure-invalid-without-secure=1';
// All browsers, including those that support the __Secure cookie prefix,
// will accept this since the Secure attribute is present.
document.cookie = '__Secure-valid-with-secure=1; Secure';

// Browsers that support the __Host cookie prefix will reject this due to the
// missing Secure and Path=/ attributes.
document.cookie = '__Host-invalid-without-secure-or-path=1';
// Browsers that support the __Host cookie prefix will reject this due to the
// missing Path=/ attribute, even though Secure was added.
document.cookie = '__Host-invalid-without-path=1; Secure';
// All browsers, including those that support the __Host cookie prefix,
// will accept this since both the Secure and Path=/ attributes are present.
document.cookie = '__Host-valid-with-secure-and-path=1; Secure; Path=/';

// Browsers that don't support Cookie Prefixes will have all of the cookies set.
// Browser that do support Cookie Prefixes will have two of the cookies set.
ChromeSamples.log(document.cookie.split('; ').sort().join('\n'));
