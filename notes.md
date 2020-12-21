# Notes go here
Hi, here's where my write-up for the assessment will go.

First of all, I would have loved to go the TypeScript route for this assessment. I was unsure if that was permissible, as
the README.md indicates any language of choice can be used, but the email I received the assessment in indicated it had
to be pure JavaScript, and so I completed it in purely JS on NodeJS runtime v12.0.0.

TypeScript would have aided greatly when passing arguments back and forth, and for the classes I defined, I could have declared true public and private methods. I would have setup the list of allowed filter types as an enums, and interfaces for the different filter types, etc. I value developer and IDE tooling greatly, and Intellisense definitely helps to get any big task done.

I would have had to use the debugger less to look at the shape of the variable I was working with a good amount of the time.

## Validation of Filter Input

You'll see the first step in my code is the validation of the provided filter input. This function performs no mutations
on the provided filter, and simply performs validation. It ensures the provided filter meets our base cases of
- Being of type "object"
- Providing the "type" parameter
- The "type" parameter must be one of our accept filter types: "is", "in", "and", or "false"

Assuming that the provided filter object is submitted via an API endpoint (or some other external requestor), we must perform
these validations, as a payload of any shape could be provided over the wire. An error is thrown at the moment when a
rule in the validation isn't met, but these messages are detailed and verbose enough to inform the requestor at what point
the validation failed at and why. 

If I had more time, I would have made these messages more composable, rather than one-offs, so that all errors within a
filter could be indicated to the requestor, rather than the first one the validation failed at.

## Deep-copy

Following a successful validation of the input, I added a custom function for deep-cloning the provided filter. I could've
used something like lodash, but it was unneeded for this small scope. We deep-copy the provided filter as-is, in case we need
to use the filter in its original state anywhere, but at the moment the original filter is unused following the copy.

I assume we'd be able to use the original filter and the simplified filter for metrics or telemtry, to understand how we might
modify our UI to better construct these filters, such that simplification be needed as little as possible.

## Simplification

I've a class called "Simplifier" that performs that main functions of simplifying the filter copy. It's pretty straightforward
when handling the "in" and "is" type filters, but the "and" filters are a bit more complex since that recursively calls the
"simplifyFilter" function of that class to simplify any nested filters.

The handling for attempting to resolve clashing and colliding nested filters of the "and" type filters was a bit nuanced and
complicated, and so I moved it over to a separate "collision.js" file where this logic could be fine-tuned and even more
far-fetched edge-cases could be resolved. 

I would have liked to create classes that, given the right input, could create the simpler filter types, like "is" and "in"
and "false", rather than creating them all inline. This is because, if the signature of those in-line simpler filter types
ever change, I'll need to go and update anywhere that I'm creating them manually inline, rather than just updating the class
that was responsible for creating them.

I added some additional tests. Use
- `npm test` to run all tests

Thank you for reading over my code, it was a busy weekend for me due to working on a major product release, but I did the best I could!