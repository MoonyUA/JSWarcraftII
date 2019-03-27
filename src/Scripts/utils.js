function GetRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function RectIntersection(r1, r2) {
	return !(r2.x > r1.x + r1.width || 
           r2.x + r2.width < r1.x || 
           r2.y > r1.y + r1.height ||
           r2.y + r2.height < r1.y);
}

function PointToRect(point) {
	return {
		x : point.x,
		y : point.y,
		width : 0,
		height : 0
	}
}

function RectToPoint(rect) {
	return {
		x : rect.x,
		y : rect.y,
	}
}

function PointDistance(a,b) {
	var result = {
		x : Math.abs(a.x - b.x),
		y : Math.abs(a.y - b.y)
	}
	result.length = Math.sqrt(result.x*result.x+result.y*result.y);
	return result;
}

function GamePointDistance(a,b) {
	var result = {
		x : Math.abs(a.x - b.x),
		y : Math.abs(a.y - b.y)
	}
	result.length = Math.max(result.x,result.y);
	return result;
}

function RectDistance(a,b) {
	var newRect = b;
	for (var distance = 0; distance < 99999; distance++){
		if (RectIntersection(a,newRect)) {
			return distance;
		}
		newRect.x -= 1;
		newRect.y -= 1;
		newRect.width += 1;
		newRect.height += 1;
	}
}

function DistanceToNearest(a,points) {
	var nearest = {
		x : 999999999,
		y : 999999999,
		length : 99999999
	}
	for (var i = 0; i<points.length; i++){
		var distance = GamePointDistance(a,points[i]);
		if (distance.length < nearest.length)
			nearest = distance;
	}
	return nearest;
}

function NormalizeRect(rect) {
	if (rect.width < 0) {
		rect.width *= -1;
		rect.x -= rect.width;
	}
	if (rect.height < 0) {
		rect.height *= -1;
		rect.y -= rect.height;
	}
	return rect;
}
