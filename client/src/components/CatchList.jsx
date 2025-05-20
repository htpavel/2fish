import "./CatchList.css";
import Catch from './Catch';

const CatchList = ({ catches, onDeleteCatch, onEditCatch }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const sortedCatches = [...catches].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });

    if (!catches || catches.length === 0) {
        return <div className="catchlist-nocatch">Žádné úlovky k zobrazení.</div>;
    }

    return (
        <div className="dashboard-catch">
            {sortedCatches.map((catchItem) => (
                <Catch
                    key={catchItem.id}
                    id={catchItem.id}
                    date={formatDate(catchItem.date)}
                    species={catchItem.name}
                    districtNr={catchItem.districtNr}
                    weight={catchItem.weight}
                    length={catchItem.length}
                    onDelete={() => onDeleteCatch(catchItem.id)}
                    onEdit={() => onEditCatch(catchItem)} // PŘEDÁVÁME CELÝ OBJEKT ÚLOVKU K EDITACI
                />
            ))}
        </div>
    );
}

export default CatchList;