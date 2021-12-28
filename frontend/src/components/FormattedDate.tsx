import format from 'date-fns/format'

export const FormattedDate = ({ date }: { date: Date }) => (
  <time dateTime={date.toISOString()}>{format(date, 'MMM d, yyyy, H:mm')}</time>
)
