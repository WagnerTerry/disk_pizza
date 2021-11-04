import './Modal.scss'
const Modal = (props) => {
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    window.onload = function () {
        //When the user clicks the button, open the modal 
        btn.onclick = () => {
            modal.style.display = "block";
        }
        //When the user clicks on < span > (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
        }

    }

    //When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    return (
        <>
            <button id="myBtn">Open Modal</button>
            {/* <button id="myBtn">{props.show}</button> */}

            <div id="myModal" className="modal">

                <div className="modal-content">
                    <div className="modal-header">
                        <span className="close">&times;</span>
                        <h2>{props.title}</h2>
                    </div>
                    <div className="modal-body">
                        {props.children}
                        {/* <p>Some text in the Modal Body</p>
        <p>Some other text...</p> */}
                    </div>
                    <div className="modal-footer">
                        <h3>{props.footer}</h3>
                    </div>
                </div>

            </div>


        </>
    )
}

export default Modal