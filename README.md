# UiBreakpoint
A simple, configurable breakpoint class for any Web project.

## Features ✨

 - Optimized for perfomance (uses media queries).
 - Works with any JavaScript project.
 - Add multiple defined breakpoints eg sm, mobile, etc.
 - Supports orientation.
 
## Config ⚙

The UiBreakpoint requires a single `object` as an argument when initializing. The properties are listed below.

<table>
    <thead>
        <tr>
            <th>Key</th>
            <th>Type</th>
            <th>Description</th>
            <th>Example</th>
            <th>Tip</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>config</td>
            <td><code>Object</code></td>
            <td>
                <ul>
                    <li>
                        Key, Value pair of name of breakpoint, and minimum px it can have.
                    </li>
                    <li>
                        The next biggest breakpoint will automatically be the
                        maximum px it can have.
                    </li>
                    <li>
                        The highest value in this object won't have a max-width query.
                    </li>
                    <li>
                        This object can be in any order, as it'll be sorted by value (ASC)
                    </li>
                </ul>
            </td>
            <td>
                                        <pre class="js">
{
    config: {
        xs: 0,
        sm: 560,
        md: 960,
        lg: 1200,
        xl: 1800,
        cinema: 4000
    }
}
                        </pre>
            </td>
            <td>
                Always use 0 as the minimum breakpoint.
            </td>
        </tr>
        <tr>
            <td>useOrientation</td>
            <td><code>Boolean</code></td>
            <td>
                Tell UiBreakpoint to check for orientation or not.
            </td>
            <td>
                <pre>
{
    ...,
    useOrientation: true
}
                </pre>
            </td>
            <td>
                It's <code>false</code> by default
            </td>
        </tr>
        <tr>
            <td>onChange</td>
            <td><code>Function</code></td>
            <td>
                A callback function that fires whenever there's a change in breakpoint. This could also mean there's a change in orientation if <code>useOrientation</code> is <code>true</code>
            </td>
            <td>
                <pre>
{
    ...,
    onChange: e => {
        console.log(e);
    }
}
                </pre>
            </td>
            <td>
                If you're using a framework like Vue, or React, you can utilize this hook to update your Global state. 
            </td>
        </tr>
    </tbody>
</table>

## Example 💁‍♀️

 
````js
const screenSizes = {
  xxs: 0,
  xs: 320,
  sm: 560,
  md: 960,
  lg: 1020,
  xl: 1920
}  

const breakpoint = new UiBreakpoint({
  config: screenSizes,
  useOrientation: true,
  onChange: e => {
    const isMobile = /xxs|xs|sm/.test(e.is);
    
    if(e.orientation == 'landscape' && isMobile){
      alert('Only portrait mode supported!')
    } 
    
    // this is where you update your store to have this globally accessible
    // for framework lovers only.
  }  
})
````
Actually, thats all about the breakpoint API.

Ciao 👋
