# Process for building Chirper

## Create Project and download breeze

## Creating Chirps

### Make Chirper model and migration file

-   Run this in the terminal: `php artisan make:model -mrc Chirp`

### Routing

<br>
1. Add a new route to web.php file

```php
use App\Http\Controllers\ChirpController;

Route::resource('chirps', ChirpController::class)
    ->only(['index', 'store'])
    ->middleware(['auth', 'verified']);
```

<br>
2. Add index function to route controller

-   For testing try this:

```php
use Illuminate\Http\Response;

/**
 * Display a listing of the resource.
 */
public function index(): Response
{
    return response('Hello, World!');
}
```

-   Now change it to render an inertia view

```php
use Inertia\Inertia;
use Inertia\Response;
/**
 * Display a listing of the resource.
 */
public function index(): Response
{
    return Inertia::render('Chirps/Index', [
        //
    ]);
}
```

<br>

3. Add chirps index react page by creating a page component resources/js/Pages/Chirps/**Index.jsx**, add neccessary code:

```jsx
import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm, Head } from "@inertiajs/react";

export default function Index({ auth }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        message: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("chirps.store"), { onSuccess: () => reset() });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Chirps" />

            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <form onSubmit={submit}>
                    <textarea
                        value={data.message}
                        placeholder="What's on your mind?"
                        className="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                        onChange={(e) => setData("message", e.target.value)}
                    ></textarea>
                    <InputError message={errors.message} className="mt-2" />
                    <PrimaryButton className="mt-4" disabled={processing}>
                        Chirp
                    </PrimaryButton>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
```

<br>

4. Update the navigation to include a route to the chirps page

-   Open resources/js/Layouts/**AuthenticatedLayout.jsx** and add this:

```jsx
// Look for the <NavLink></NavLink> component and paste the ff after it:
<NavLink href={route('chirps.index')} active={route().current('chirps.index')}>
    Chirps
</NavLink>

// look for the <ResponsiveNavLink></ResponsiveNavLink> and paste the ff:
<ResponsiveNavLink href={route('chirps.index')} active={route().current('chirps.index')}>
    Chirps
</ResponsiveNavLink>
```

### Saving chirps to db

<br>
1. Update our chirp controller to allow saving the chirp to the chirps.store route

-   Open App/Http/Controllers/**ChirpController.php** file and add this code to the necessary place:

```php
use Illuminate\Http\RedirectResponse;

public function store(Request $request): RedirectResponse
{
    //
    $validated = $request->validate([
        'message' => 'required|string|max:255',
    ]);

    $request->user()->chirps()->create($validated);

    return redirect(route('chirps.index'));
}
```

Above code stores the data into the db and redirects back to the index route

NB: TABLE,RELATIONSHIPS of chirps have not yet been created

<br>
2. Add chirps and user model relationships.

-   Open the **User.php** file in the Model folder and add:

```php
use Illuminate\Database\Eloquent\Relations\HasMany;

public function chirps(): HasMany
{
  return $this->hasMany(Chirp::class);
}
```

-   Open the **Chirp.php** file in the Model folder and add:

```php
public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}
```

-   Prevent [mass assignment](https://bootcamp.laravel.com/livewire/creating-chirps#mass-assignment-protection) on the Chirps model by adding this:

```php
protected $fillable = [
    'message',
];
```

<br>
3. Update chirps migration with the neccessary db columns

-   Open migration file for chirps and add:

    ```php
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('message');
    ```

-   Now migrate the database: `php artisan migrate`

<br>
4. [Optional] Test to see if validations work and if message is saved to the db

-   For validation, try submitting the form with no message and also try inputting text more than 255 characters long.

-   For saving, try to type a valid sentence like, **"I'm building Chirper with laravel"** and save it. Now to see if it was successful open laravel tinker, `php artisan tinker`, and type `App\Models\Chirp::all()` to see all chirps saved in the databse currently. If successful you should see your message.

## Viewing chirps

### Retrieving Chirps

<br>
1. Create a new livewire component that will display a list of all the chirps

-   Type this in the terminal: `php artisan make:volt chirps/list`
-   A file will be made called resources/views/livewire/chirps/**list.blade.php**. Open it and add this:

```php
// in php tag
use App\Models\Chirp;

// We'll be changing this line later
state(['chirps' => fn () => Chirp::with('user')->latest()->get()]);

//
<div class="mt-6 bg-white divide-y rounded-lg shadow-sm">
    @foreach ($chirps as $chirp)
        <div class="flex p-6 space-x-2" wire:key="{{ $chirp->id }}">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-600 -scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <div class="flex-1">
                <div class="flex items-center justify-between">
                    <div>
                        <span class="text-gray-800">{{ $chirp->user->name }}</span>
                        <small class="ml-2 text-sm text-gray-600">{{ $chirp->created_at->format('j M Y, g:i a') }}</small>
                    </div>
                </div>
                <p class="mt-4 text-lg text-gray-900">{{ $chirp->message }}</p>
            </div>
        </div>
    @endforeach
</div>
```

<br>
2. Add the new livewire component to the chirps.blade.php file

```php
<livewire:chirps.list />
```

<br>
3. Add a way to update the list in real time when someone adds a new chirp

-   First dispatch an event whenever a chirp is created. Open create.blade.php and add

```php
// in the store function
$this->dispatch('chirp-created');
```

-   Now we listen for the chirp created event in the list component

```php
use function Livewire\Volt\{on, state};

// this replaces: state(['chirps' => Chirp::with('user')->latest()->get()]);
$getChirps = fn () => $this->chirps = Chirp::with('user')->latest()->get();

state(['chirps' => $getChirps]);

on(['chirp-created' => $getChirps]);
```

## Editing Chirps

<!-- volt mount ???? -->

1. Create a livewire edit form component that saves the edited chirp

-   Run this to create livewire component: `php artisan make:volt chirps/edit`. Open resources/views/livewire/chirps/**edit.blade.php** and add

```php
// in php
use function Livewire\Volt\{mount, rules, state};

state(['chirp', 'message']);

rules(['message' => 'required|string|max:255']);

// when form appears assign chirp message to message state
mount(fn () => $this->message = $this->chirp->message);

$update = function () {
    // this check to see if user is authorised to update chirp
    // the policy is yet to be made
    $this->authorize('update', $this->chirp);

    $validated = $this->validate();

    $this->chirp->update($validated);

    $this->dispatch('chirp-updated');
};

// this triggers when chirp edit is canceled
$cancel = fn () => $this->dispatch('chirp-edit-canceled');

// in html div
<form wire:submit="update">
    <textarea
        wire:model="message"
        class="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
    ></textarea>

    <x-input-error :messages="$errors->get('message')" class="mt-2" />
    <x-primary-button class="mt-4">{{ __('Save') }}</x-primary-button>
    <button class="mt-4" wire:click.prevent="cancel">Cancel</button>
</form>
```

2. Create a policy to only allow authorized users to update their own chirps

-   Create policy with `php artisan make:policy ChirpPolicy --model=Chirp`

-   Open the app/**ChirpPolicy.php** file and update the update function:

```php
return $chirp->user()->is($user);
```

<br>
3. Add dropdown menu with an edit button to chirps that belong to the currently authenticated. This edit button will change the message into the llivewire edit form when pressed

```php
// in php tag
// update state with
state(['chirps' => $getChirps, 'editing' => null]);

// add edit function
$edit = function (Chirp $chirp) {
$this->editing = $chirp;

    $this->getChirps();

};

// in html
// this is below: <small class="ml-2 text-sm text-gray-600">{{ $chirp->created_at->format('j M Y, g:i a') }}</small>
// This shows on chirps that have been edited
@unless ($chirp->created_at->eq($chirp->updated_at))
<small class="text-sm text-gray-600"> &middot; {{ __('edited') }}</small>
@endunless

// after div with unless code
// shows dropdown menu on chirps created by currently authenticated user
@if ($chirp->user->is(auth()->user()))
<x-dropdown>
<x-slot name="trigger">
<button>
<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
<path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
</svg>
</button>
</x-slot>
<x-slot name="content">
<x-dropdown-link wire:click="edit({{ $chirp->id }})">
{{ __('Edit') }}
</x-dropdown-link>
</x-slot>
</x-dropdown>
@endif

// replaces: <p class="mt-4 text-lg text-gray-900">{{ $chirp->message }}</p>
// when edit button pressed, replace message with edit form
@if ($chirp->is($editing))
<livewire:chirps.edit :chirp="$chirp" :key="$chirp->id" />
@else

<p class="mt-4 text-lg text-gray-900">{{ $chirp->message }}</p>
@endif

```

<br>
3. Update the list component to react when a chirp get updated or an update is canceled by the user:

```php
$disableEditing = function () {
    $this->editing = null;

    return $this->getChirps();
};

// this replaces: on(['chirp-created' => $getChirps]);
on([
    'chirp-created' => $getChirps,
    'chirp-updated' => $disableEditing,
    'chirp-edit-canceled' => $disableEditing,
]);
```

## Delete Chirps

<br>
1. Open the ChirpPolicy file and add this to the delete function

```php
// anyone authorized to update a chirp will be authorized to delete a chirp by calling the update method here
return $this->update($user, $chirp);
```

2. Create a delete button with delete functionality in the list.blade file

```php
$delete = function (Chirp $chirp) {
    $this->authorize('delete', $chirp);

    $chirp->delete();

    $this->getChirps();
};

// after the edit dropdown
<x-dropdown-link wire:click="delete({{ $chirp->id }})" wire:confirm="Are you sure to delete this chirp?">
    {{ __('Delete') }}
</x-dropdown-link>
```

## Notifications & Events

### Creating the notification

1. Create file with artisan command `php artisan make:notification NewChirp`

2. Now we send the newly created chirp to the notification and include the author's name along with a snippet of the message.

```php
// this should be imported for everything to work
use App\Models\Chirp;
use Illuminate\Support\Str;

// replace the construct function with this
public function __construct(public Chirp $chirp)

// replace the first line and action with this, leave the last line
->subject("New Chirp from {$this->chirp->user->name}")
->greeting("New Chirp from {$this->chirp->user->name}")
->line(Str::limit($this->chirp->message, 50))
->action('Go to Chirper', url('/'))
```

### Creating events

-   Create event with `php artisan make:event ChirpCreated`

-   Add this to the event file app/Events/**ChirpCreated.php**:

```php
public function __construct(public Chirp $chirp)
```

### Dispatching Event

Since the creation of a chirp is what triggers the event we'll dispatch it from the Chirp model file with this code

```php
protected $dispatchesEvents = [
    'created' => ChirpCreated::class,
];
```

### Creating Evenmt Listeners

We'll make an event listener to listen to the Chirp created event with this `php artisan make:listener SendChirpCreatedNotifications --event=ChirpCreated` and we'll add this code to this file app/Listeners/**SendChirpCreatedNotifications.php**:

```PHP
//depends on these
use App\Models\User;
use App\Notifications\NewChirp;

// replaces this: class SendChirpCreatedNotifications
class SendChirpCreatedNotifications implements ShouldQueue

// put this in the handle function
// this sends a notification to all users except the author when a chirp is created
foreach (User::whereNot('id', $event->chirp->user_id)->cursor() as $user) {
    $user->notify(new NewChirp($event->chirp));
}
```

### Register event listener

Open the **EventServiceProvider** class and register the event so that it invokes the event listener when the event is dispatched.
Type this:

```php
// in the protected $listen property add this:
ChirpCreated::class => [
    SendChirpCreatedNotifications::class,
],
```
