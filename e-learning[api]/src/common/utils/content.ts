export function createSlug(name: string) {
  let nameStr = ''
  if (name) {
    const newName = name!
      .replace(/[\W\s]/g, ' ') // replace non-char with space
      .replace(/\s+/g, '_'); // remove unnessecery spaces
    const newDate = formatDate(new Date(), '_');
    nameStr = `${newName}_${newDate}`;
  }

  return nameStr;
}

export function createVersion() {
  const version = formatDate(new Date(), '-');
  return version;
}

function formatDate(date: Date, sep: string) {
  const datestr = date.toLocaleDateString('en-us', {
    month: '2-digit',
    year: 'numeric',
  });
  return datestr.replace('/', sep);
}
