import { FunctionComponent } from 'react'
import Badge, { BadgeColor } from '../components/Badge'
import Button from '../components/Button'
import LayoutWithNav from '../layouts/LayoutWithNav'

const KitchenSink: FunctionComponent = () => {
  return (
    <LayoutWithNav>
      <main className="max-w-3xl mx-auto px-4 py-12 space-y-12">
        <section>
          <h1 className="text-2xl mb-6">Buttons</h1>
          <div className="grid grid-cols-4">
            <div>
              Default button:
              <Button>Click me</Button>
            </div>
            <div>
              Disabled button:
              <Button disabled>Click me</Button>
            </div>
            <div>
              Primary variant:
              <Button variant="primary">Click me</Button>
            </div>
            <div>
              Primary and disabled:
              <Button variant="primary" disabled>
                Click me
              </Button>
            </div>
          </div>
        </section>
        <section>
          <h1 className="text-2xl mb-4">Badges</h1>
          <p className="text-gray-800 mb-4">
            Badges are used to represent statuses and make them easy to parse at
            a glance.
          </p>
          <div className="space-y-2">
            {(
              [
                'gray',
                'red',
                'navy',
                'blue',
                'green',
                'yellow',
                'purple',
              ] as BadgeColor[]
            ).map((color) => (
              <div key={color}>
                <span className="w-16 inline-block">{color}: </span>
                <Badge color={color}>{color}</Badge>
              </div>
            ))}
          </div>
        </section>
      </main>
    </LayoutWithNav>
  )
}

export default KitchenSink
