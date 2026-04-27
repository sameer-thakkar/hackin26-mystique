
# Swift Code Fixer

Target iOS 18+ / Swift 6.0+ with strict concurrency. Fix deprecated APIs and anti-patterns.

## Critical Fixes

### SwiftUI Modifiers

```swift
// ❌ Deprecated
.foregroundColor(.red)
.cornerRadius(10)
.onChange(of: value) { newValue in }

// ✅ Modern
.foregroundStyle(.red)
.clipShape(.rect(cornerRadius: 10))
.onChange(of: value) { oldValue, newValue in }
// or: .onChange(of: value) { }
```

### State Management

```swift
// ❌ Legacy
class ViewModel: ObservableObject {
    @Published var items: [Item] = []
}

// ✅ Modern
@Observable
@MainActor
class ViewModel {
    var items: [Item] = []
}
```

### Navigation

```swift
// ❌ Deprecated
NavigationView {
    List(items) { item in
        NavigationLink(destination: DetailView(item: item)) {
            Text(item.name)
        }
    }
}
.tabItem { Label("Home", systemImage: "house") }

// ✅ Modern
NavigationStack {
    List(items) { item in
        NavigationLink(value: item) { Text(item.name) }
    }
    .navigationDestination(for: Item.self) { item in
        DetailView(item: item)
    }
}
Tab("Home", systemImage: "house") { ContentView() }
```

### Buttons & Accessibility

```swift
// ❌ Poor accessibility
Image(systemName: "trash").onTapGesture { delete() }
Button { action() } label: { Label("Save", systemImage: "square.and.arrow.down") }

// ✅ VoiceOver-friendly
Button("Delete", systemImage: "trash", role: .destructive) { delete() }
Button("Save", systemImage: "square.and.arrow.down") { action() }
```

### Formatting & URLs

```swift
// ❌ C-style / verbose
String(format: "%.2f", price)
FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
Task.sleep(nanoseconds: 1_000_000_000)
url.appendingPathComponent("file.txt")

// ✅ Modern
Text(price, format: .number.precision(.fractionLength(2)))
URL.documentsDirectory
try await Task.sleep(for: .seconds(1))
url.appending(path: "file.txt")
```

### String Operations

```swift
// ❌ Foundation methods
str.replacingOccurrences(of: "old", with: "new")
items.filter { $0.name.lowercased().contains(query.lowercased()) }

// ✅ Swift-native
str.replacing("old", with: "new")
items.filter { $0.name.localizedStandardContains(query) }  // handles case + diacritics
```

### Static Member Lookup

```swift
// ❌ Explicit struct instances
.clipShape(Circle())
.buttonStyle(BorderedProminentButtonStyle())
.background(RoundedRectangle(cornerRadius: 8))

// ✅ Static member syntax
.clipShape(.circle)
.buttonStyle(.borderedProminent)
.background(.rect(cornerRadius: 8))
```

### View Structure

```swift
// ❌ No view invalidation optimization
var body: some View {
    VStack { headerView; contentView }
}
var headerView: some View { Text("Header") }

// ✅ Separate structs benefit from diffing
var body: some View {
    VStack { HeaderView(); ContentView() }
}
struct HeaderView: View { var body: some View { Text("Header") } }
```

## SwiftData CloudKit Rules

- Never `@Attribute(.unique)` -- incompatible with CloudKit
- All properties need defaults or be optional
- All relationships must be optional

## Prohibitions

- No `!` except unrecoverable scenarios
- No `DispatchQueue.main.async` -- use `@MainActor`
- No UIKit unless explicitly requested
- No third-party deps without approval
- No hard-coded padding/spacing
- No `AnyView` unless necessary
- No `UIScreen.main.bounds` -- use `containerRelativeFrame()` or `GeometryReader`
- No UIKit colors in SwiftUI -- use `Color` or `.tint`
- No secrets/API keys in repo

## Code Quality

- View logic in view models for testability
- Unit tests for business logic; UI tests only when unit tests insufficient
- SwiftLint must pass before committing

## File Organization

- One type per file (improves build times)
- Extract subviews into separate `View` structs
- Feature-based folder structure

## Extended Patterns

See [references/extended-patterns.md](references/extended-patterns.md) for: concurrency, SwiftData, layout, animations, testing.
