# Simple Availability Checker

## Usage

This package can be installed globally through npm, or executed with npx.

> `npx simple-availability-checker`

On first launch, you'll be asked a series of questions.

-   _url_: For the url, you should input the store page for the product that is currently out of stock.
-   _interval_: The interval represents the amount of time in between requests (in seconds). I don't recommend setting it to less than 15 seconds.
-   _selector_: This is a CSS selector for the element that represents the product being out of stock. During a check, if the selector doesn't find an element we assume the product is available.
-   _productName_: This is a display name for the product. It is only used when notifying you should the product become available.

After you answer these questions, you'll be asked if you want to save them. If you do, you can provide a name for the profile.

## Profiles

If you've saved a profile, you can specify it when running to not have to input the answers again. To run it pass the profile argument like this.

```shell
npx simple-availability-checker --profile {profileName}
```

When running with a profile, you can override any of the answers above by passing it as well. For example, to override the productName answer you could do something like this.

```shell
npx simple-availability-checker --profile MyProfile --product-name OtherName
```
