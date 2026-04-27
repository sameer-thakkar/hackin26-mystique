# Extended Swift/SwiftUI Patterns

## Table of Contents
- [Concurrency Patterns](#concurrency-patterns)
- [SwiftData Patterns](#swiftdata-patterns)
- [SwiftUI Layout Patterns](#swiftui-layout-patterns)
- [String & Collection APIs](#string--collection-apis)
- [Animation Patterns](#animation-patterns)
- [Testing Patterns](#testing-patterns)

---

## Concurrency Patterns

### Actor Isolation

```swift
// ❌ Manual dispatch
class DataManager {
    func fetchData() {
        DispatchQueue.main.async {
            self.updateUI()
        }
    }
}

// ✅ Actor isolation
@MainActor
class DataManager {
    func fetchData() async {
        let data = await api.fetch()
        updateUI(data) // Already on main actor
    }
}
```

### Async Sequences

```swift
// ❌ Callback-based
NotificationCenter.default.addObserver(self, selector: #selector(handle), name: .didChange, object: nil)

// ✅ AsyncSequence
for await _ in NotificationCenter.default.notifications(named: .didChange) {
    handleChange()
}
```

### Task Groups

```swift
// ❌ Serial fetching
var results: [Result] = []
for id in ids {
    results.append(await fetch(id))
}

// ✅ Parallel with TaskGroup
let results = await withTaskGroup(of: Result.self) { group in
    for id in ids {
        group.addTask { await fetch(id) }
    }
    return await group.reduce(into: []) { $0.append($1) }
}
```

### Cancellation

```swift
// ✅ Check cancellation in long operations
func processItems(_ items: [Item]) async throws {
    for item in items {
        try Task.checkCancellation()
        await process(item)
    }
}
```

---

## SwiftData Patterns

### Model Definition

```swift
// ❌ CloudKit-incompatible
@Model
class Item {
    @Attribute(.unique) var id: UUID  // Breaks CloudKit sync
    var name: String
    var category: Category  // Non-optional relationship
}

// ✅ CloudKit-compatible
@Model
class Item {
    var id: UUID = UUID()
    var name: String = ""
    var category: Category?  // Optional relationship

    init(name: String, category: Category? = nil) {
        self.name = name
        self.category = category
    }
}
```

### Queries

```swift
// ❌ Fetch in view body
var body: some View {
    let items = try? context.fetch(FetchDescriptor<Item>())
    // ...
}

// ✅ Use @Query
@Query(sort: \Item.name) private var items: [Item]
@Query(filter: #Predicate<Item> { $0.isComplete }) private var completed: [Item]
```

### Batch Operations

```swift
// ✅ Batch insert
try context.transaction {
    for data in largeDataset {
        context.insert(Item(data: data))
    }
}

// ✅ Batch delete
try context.delete(model: Item.self, where: #Predicate { $0.isExpired })
```

---

## SwiftUI Layout Patterns

### Container-Relative Sizing

```swift
// ❌ GeometryReader for simple sizing
GeometryReader { geo in
    Image("photo")
        .frame(width: geo.size.width * 0.8)
}

// ✅ containerRelativeFrame
Image("photo")
    .containerRelativeFrame(.horizontal) { length, _ in
        length * 0.8
    }
```

### Visual Effects

```swift
// ❌ GeometryReader for position-based effects
GeometryReader { geo in
    let minY = geo.frame(in: .global).minY
    content.opacity(minY > 0 ? 1 : 0)
}

// ✅ visualEffect
content.visualEffect { content, proxy in
    content.opacity(proxy.frame(in: .global).minY > 0 ? 1 : 0)
}
```

### ScrollView Enhancements

```swift
// ✅ Modern scroll APIs
ScrollView {
    content
}
.scrollIndicators(.hidden)
.scrollTargetBehavior(.paging)
.scrollPosition(id: $scrolledID)
.defaultScrollAnchor(.bottom)
```

### Safe Area Handling

```swift
// ❌ Manual safe area calculation
.padding(.top, UIApplication.shared.windows.first?.safeAreaInsets.top ?? 0)

// ✅ SwiftUI safe area
.ignoresSafeArea(edges: .top)
.safeAreaInset(edge: .bottom) { toolbar }
```

---

## String & Collection APIs

### String Operations

```swift
// ❌ Foundation methods
str.replacingOccurrences(of: "old", with: "new")
str.hasPrefix("test")
str.components(separatedBy: ",")

// ✅ Swift stdlib
str.replacing("old", with: "new")
str.starts(with: "test")
str.split(separator: ",")
```

### Filtering & Searching

```swift
// ❌ Case-insensitive search
items.filter { $0.name.lowercased().contains(query.lowercased()) }

// ✅ Localized search (handles diacritics, case)
items.filter { $0.name.localizedStandardContains(query) }
```

### Collection Algorithms

```swift
// ❌ Manual enumeration
ForEach(Array(items.enumerated()), id: \.element.id) { index, item in }

// ✅ Direct enumeration (no Array conversion needed)
ForEach(items.enumerated(), id: \.element.id) { index, item in }

// ✅ Modern algorithms
let chunks = array.chunks(ofCount: 3)
let unique = array.uniqued()  // from Algorithms package
```

---

## Animation Patterns

### Phase Animations

```swift
// ❌ Manual state toggling
@State private var isAnimating = false
.onAppear { withAnimation(.easeInOut.repeatForever()) { isAnimating = true } }

// ✅ PhaseAnimator
PhaseAnimator([false, true]) { phase in
    Circle()
        .scaleEffect(phase ? 1.2 : 1.0)
}
```

### Keyframe Animations

```swift
// ✅ Complex multi-property animations
Text("Hello")
    .keyframeAnimator(initialValue: AnimationValues()) { content, value in
        content
            .scaleEffect(value.scale)
            .rotationEffect(value.rotation)
    } keyframes: { _ in
        KeyframeTrack(\.scale) {
            SpringKeyframe(1.5, duration: 0.3)
            SpringKeyframe(1.0, duration: 0.3)
        }
        KeyframeTrack(\.rotation) {
            LinearKeyframe(.degrees(360), duration: 0.6)
        }
    }
```

### Transitions

```swift
// ✅ Custom transitions
.transition(.asymmetric(
    insertion: .push(from: .trailing),
    removal: .push(from: .leading)
))

// ✅ Combined transitions
.transition(.scale.combined(with: .opacity))
```

---

## Testing Patterns

### Unit Tests

```swift
// ✅ Test business logic, not UI
@Test func calculateTotal() {
    let cart = Cart(items: [Item(price: 10), Item(price: 20)])
    #expect(cart.total == 30)
}

// ✅ Async testing
@Test func fetchUser() async throws {
    let user = try await api.fetchUser(id: 1)
    #expect(user.name == "John")
}
```

### SwiftData Testing

```swift
// ✅ In-memory container for tests
@Test func itemPersistence() throws {
    let config = ModelConfiguration(isStoredInMemoryOnly: true)
    let container = try ModelContainer(for: Item.self, configurations: config)
    let context = container.mainContext

    context.insert(Item(name: "Test"))
    try context.save()

    let items = try context.fetch(FetchDescriptor<Item>())
    #expect(items.count == 1)
}
```

### Preview Testing

```swift
// ✅ Previews with sample data
#Preview {
    ContentView()
        .modelContainer(previewContainer)
}

@MainActor
let previewContainer: ModelContainer = {
    let config = ModelConfiguration(isStoredInMemoryOnly: true)
    let container = try! ModelContainer(for: Item.self, configurations: config)
    container.mainContext.insert(Item.sample)
    return container
}()
```
