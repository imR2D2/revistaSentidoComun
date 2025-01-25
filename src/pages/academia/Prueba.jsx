import HTMLFlipBook from "react-pageflip";

const Pages = React.forwardRef((props, ref) => {
    return (
        <div className="demoPage" ref={ref}>
            <h1>Page Header</h1>
            <p>{props.children}</p>
            <p>Page number: {props.number}</p>
        </div>
    );
});

Pages.displayName = "Pages";

function Prueba(props) {
    return (
        <HTMLFlipBook width={300} height={500}>
            <Pages number="1">Page text</Pages>
        </HTMLFlipBook>
    );
}

export default Prueba