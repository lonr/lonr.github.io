export interface PagingInfo {
  pageCount: number;
  currentPage: number;
  routerLinkBuilder: (page: string | number) => string;
  marginPageCount?: number;
  surroundingPageCount?: number;
}

export type CompletePagingInfo = PagingInfo & { marginPageCount: number; surroundingPageCount: number };

export interface PagingNumber {
  page: number;
  isCurrent: boolean;
  isInGap: boolean;
  routerLink: string;
}

export type PagingNumbers = PagingNumber[];

/// Returns 1 if value changed, 0 if not
function mark<K extends keyof PagingNumber>(
  numbers: PagingNumbers,
  index: number,
  key: K,
  value: PagingNumber[K],
): 0 | 1 {
  if (index >= 0 && index < numbers.length && numbers[index][key] !== value) {
    numbers[index][key] = value;
    return 1;
  }
  return 0;
}

function unGapMargins(
  numbers: PagingNumbers,
  { marginPageCount, pageCount }: CompletePagingInfo,
): number {
  let numberCount = 0;
  for (
    let count = marginPageCount, leftIndex = 0, rightIndex = pageCount - 1;
    count > 0;
    count--, leftIndex++, rightIndex--
  ) {
    numberCount += mark(numbers, leftIndex, 'isInGap', false);
    numberCount += mark(numbers, rightIndex, 'isInGap', false);
  }
  return numberCount;
}

function unGapSurroundings(
  numbers: PagingNumbers,
  { surroundingPageCount }: CompletePagingInfo,
  center: number,
) {
  let numberCount = 0;
  for (
    let count = surroundingPageCount, leftIndex = center - 2, rightIndex = center;
    count > 0;
    count--, leftIndex--, rightIndex++
  ) {
    numberCount += mark(numbers, leftIndex, 'isInGap', false);
    numberCount += mark(numbers, center - 1, 'isInGap', false);
    numberCount += mark(numbers, rightIndex, 'isInGap', false);
  }
  return numberCount;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#replace_.filter.map_with_.reduce
// function mergeGaps(numbers: PagingNumbers): PagingNumbers {
//   return numbers.reduce((prev, curr) => {
//     if (!curr.isInGap) {
//       prev.push(curr);
//       return prev;
//     }
//     const isPrevInGap = prev.length > 0 && prev[prev.length - 1].isInGap;
//     if (curr.isInGap && !isPrevInGap) {
//       prev.push(curr);
//     }
//     return prev;
//   }, [] as PagingNumbers);
// }

function mergeGaps(numbers: PagingNumbers): PagingNumbers {
  return numbers.filter((curr, index, numbers) => {
    if (!curr.isInGap) {
      return true;
      // curr isInGap and not the first and prev is not InGap
    } else if (curr.isInGap && index > 0 && !numbers[index - 1].isInGap) {
      return true;
    }
    return false;
  })
}

export function paginateNumbers(info: CompletePagingInfo): PagingNumbers {
  const numbers: PagingNumbers = [];
  let numberCount = 0;
  // Initialization. all numbers are marked isInGap
  for (let count = 0; count < info.pageCount; count++) {
    numbers.push({
      page: count + 1,
      isCurrent: false,
      isInGap: true,
      routerLink: info.routerLinkBuilder(count + 1),
    });
  }
  numbers[info.currentPage - 1].isCurrent = true;
  // Mark margins not isInGap
  numberCount += unGapMargins(numbers, info);
  // Mark current number's surrounding numbers not isInGap
  numberCount += unGapSurroundings(numbers, info, info.currentPage);

  if (numberCount === info.pageCount) {
    return numbers;
  }

  const aimNumberCount = info.marginPageCount * 2 + info.surroundingPageCount * 2 + 1;
  // Current number is far too left or right
  if (numberCount < aimNumberCount) {
    // The min number away from the leftest for enough aimNumberCount
    const minLeft = info.marginPageCount + info.surroundingPageCount + 1;
    const maxRight = info.pageCount - minLeft + 1;
    if (info.currentPage < minLeft) {
      unGapSurroundings(numbers, info, minLeft);
    } else {
      // If numberCount is not enough and `info.currentPage !< minLeft`,
      // then `info.currentPage > maxRight` must be true
      unGapSurroundings(numbers, info, maxRight);
    }
  }
  return mergeGaps(numbers);
}

// Testing https://www.typescriptlang.org/play?#code/AQSwdgLgpgTgZgQwMZWABQQc3JgkmOAe2AG8AoYYAByygGFCBXSALmDEYFsAjWAbgrAkjGDCiQMmKGw49+gmE2gwAMuADWAIUYgANgBNYbABQ0pbAM4QYOYAB92XXjACUwALwA+YFZthMApScCDDYYJL0TJAA-DJO8pQWIorM+jgRDMwQsY5yMAIAvmRkEACeVKgMnFS6UNCSOPhEHuhYjQTEAGSkwMGh4BlREHF5fD7JUWn+g1kjzsAFAiXlqA3+AHLxMBYta5ibeQDaALpLoJCwiCitYftbpIIgFnTJ4sPA3ISEtQhggaAWfAAcQQVDYn2+UF+-xSyjUYHUlmsOEKxQA9BjgAAlOoiMA7ACMoDgwAAbghdIxUEgABa-KT6AA0wAADMT2IQIGQ4MwkBAQIQwL0QuoADwAaWAUAAHtAwPoduooKVCCS9gdnJ5jIJZM4LGx1VsLIzHvKZXNYCbKErSmxxVayRSqQa2hstodxccTS42GyHETyJQQCTjOBDNLgJ53KzgJ1umGZcBRbk9QA6Wr+CA02PdXWwCyHBPS46HG3HYAAQnc0fJlKgbkDlBT+cLZuLpeV5ZrTqg-0oYggeOABP+RX7uJgQpZqO5vP5guAzBBVAAsiEwhZtZQ89sXbcNfmHSRhf1wrRMpBmWZIlkFmwqjU6lA9k1CN6LTAHpRahBmzAL7+0bToIRCfluTY-kIQwtH0YQzJewC1HAED4OGLQssyNiYDSKFti014AcAAC0w59lBt7eMBTbkZARFEcySG4eGADUzGYSA2FMTKdGCA2gjblshHMdGfTqMYO7GohUDIahMrMgA5E8wKgvJzKILoFj1mRO5CSJIriUa7GcbJ0oKUpYDLqpwDqZpLijgoE5CjpQwzjyYB8gKQpLqCADKEypDgm46kae44Ae2xHuMoiTOk57QQU96ENUP7Pq6eAdA6KAXDAH7el+Um-s5t5Af8oHAOB351DRgFRSk8qxVIAEMdJXERtGWXKMRwAAExGThJktB1CRNkg0GUWRo1ZHRzUyW203AFh-VtqxvH5QJeS6SeYkSTNrVmYCFkqWpFK2dpgnQcJW0GXkklDZ+JEEvtylUFZNlafxf6baJ116n1e3AIpB2WcdGnvZQY4LY5n0uWQRRkJiOEQFQ+oYoYpJQLohAVDAqacIQABeei6AgqaEKEaLiERACqPlovohBIBYaIAOpQNwaIAFIIOSPlIDYVAQGiOJwLA4goGiQKY9wFIAPoAPLcAAVlAfJMwAgqICClELUD6IwKAAMRiDUyBQDLqZwHoyi46CMsAO4gFm5tiHrKDw2i1lzp5vSwFIy6bhJoVujdPo3GFRoPJi46DpOf4WKmLv61AximGIpLMsIohuF4kce9RwblRWmc4+Zy58VH1HUGnqZUIwFg0sYxd2e7lfR0OVBpwIFfgy31Gjfiv5PGgafPfh1cZpgWaRjGcZV1ApKHB38-puIk-Zg9xypqXoJd3nTYF43yRb0DoI5pWQ8j4dVDl3v1FL6SNd1w3Te75XRTd5DMdCvfr-g8yJzAAQDsQ0IdX5wzch5BcnBfZQH9j9fMQc7gh0QeFHYjYBxDgkhbK2sAU7F2ZEWZkEls7eEbEGEMRcj7b2vmtJsGDY7WCpGRSgmJi4AlHr8fQHJfxZlQJbbYv5OFz1JACbhwBnofQKFKUG7JD6iGPqPWeRZp5slnhWCSrY0IbwUVfPird6FCkYb2SRH0DHWROsY8GLhYbFE9u5ecQpuA6AMCAvUoYOiJWSk+F8HRQ6uPzPlfuVg44oIjtGE4-xIJFUgOhf4mJ8COxABSEA+MEAONTIA3Qug46ALEFtXW7Cr4gTJuVSCk0YklWqkmc4RAa5xSyGMcpEBWJ6KbFg2u9djBkP3s8V4rBzGgwdPnE+YJgBGKGXQpQsB4SIhqYQBOUzVAaG0HoQwMBG4XWHC4CZBRm493WnqVstTi5vAiF1Akm8ngvFEG8FoRi4kezXDAdQJ4NxiOocFDaF1ozeVXOucAAdDJzL2cATETyXknJiTueSOwkjRQCv4HJYBOSFOXJ85wm1fl+XhfVfwgKboEIynM1MkKIARGbo8EM0TALVmJQRIYrS26xwkvZQQQTBEgE4OFQi0ZwC1NggMepMSABUPVgDMWJXCuqUxMDwV-KK7q4rSKCExNcsQUL7hPHMZ+CAXwpLIWACUxaXJyHlWpdUhAnLuUMtoZiAAKjSVAnBwB-kAXbLW1lFCcDGY6-V0BgllXEEwbCgCrXnSyB9dlvRwAqBai0Pl8yBVnkapshNqYpUxWmEK38EqRyRsFME4I0osQcRwvGjodSU23hIs6sAsaDW5rIgfNNpKznJlrfWiAjKmxYv8rizA+LfpzOZB2lqILwbSM0rQlhHtcAknNVq5Fv4g2MBDUIgABi2vpZLaDVNHchddEyZ0+vEMATdFbW27u8EWktnF129Drr+XgYyYBUg+pQXtOKZWDsPMO4UxbS1drIhDCGmIzEsocl-H2oRYGgh-dsZucNIJmHaM0aMjZ6WzGHAAVkytuiIbAAAcDpYTTOWc4tZJhrxIj8Jgewf4SFnrRNwTGA60QABISDXgKIe2GSwgmQnTIQTAxgnGrP8dsLprzBVVv6Y9WqmbZXZrYL1YAqZ1Mof8K+BYLhm5AA
